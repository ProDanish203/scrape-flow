import prisma from "@/lib/prisma";
import { ExecuteWorkflow } from "@/lib/workflow/executeWorkflow";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import {
  ExecutionPhaseStatus,
  WorkflowExecutionPlan,
  WorkflowExecutionStatus,
  WorkflowExecutionTrigger,
  WorkflowStatus,
} from "@/types/workflow";
import { timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import cronParser from "cron-parser";

// For security reasons, we need to validate the secret using a constant-time comparison function to prevent timing attacks.
function isValidSecret(secret: string) {
  const API_SECRET = process.env.NEXT_PUBLIC_API_KEY;
  if (!API_SECRET) return false;

  try {
    return timingSafeEqual(Buffer.from(secret), Buffer.from(API_SECRET));
  } catch (err) {
    return false;
  }
}

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer "))
      return NextResponse.json(
        { message: "Unauthorized access", success: false },
        { status: 401 }
      );

    const secret = authHeader.split(" ")[1];
    if (!isValidSecret(secret))
      return NextResponse.json(
        { message: "Unauthorized access", success: false },
        { status: 401 }
      );

    const { searchParams } = new URL(req.url);
    const workflowId = searchParams.get("workflowId") as string;

    if (!workflowId)
      return NextResponse.json(
        { message: "Invalid workflow id", success: false },
        { status: 400 }
      );

    const workflow = await prisma.workflow.findUnique({
      where: { id: workflowId, status: WorkflowStatus.PUBLISHED },
    });

    if (!workflow)
      return NextResponse.json(
        { message: "Workflow not found", success: false },
        { status: 404 }
      );

    const executionPlan = JSON.parse(
      workflow.executionPlan!
    ) as WorkflowExecutionPlan;

    if (!executionPlan)
      return NextResponse.json(
        { message: "Workflow execution plan not found", success: false },
        { status: 404 }
      );

    try {
      const cron = cronParser.parseExpression(workflow.cron!, { utc: true });
      const nextRun = cron.next().toDate();

      const execution = await prisma.workflowExecution.create({
        data: {
          workflowId,
          userId: workflow.userId,
          definition: workflow.definition,
          status: WorkflowExecutionStatus.PENDING,
          startedAt: new Date(),
          trigger: WorkflowExecutionTrigger.CRON,
          phases: {
            create: executionPlan.flatMap((phase) => {
              return phase.nodes.flatMap((node) => {
                return {
                  userId: workflow.userId,
                  status: ExecutionPhaseStatus.CREATED,
                  number: phase.phase,
                  node: JSON.stringify(node),
                  name: TaskRegistry[node.data.type].label,
                };
              });
            }),
          },
        },
      });

      await ExecuteWorkflow(execution.id, nextRun);

      return NextResponse.json(
        {
          message: "Workflow executed successfully",
          success: true,
        },
        { status: 200 }
      );
    } catch (err) {
      return NextResponse.json(
        { message: "Internal Server Error", success: false },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error(err);
  }
}
