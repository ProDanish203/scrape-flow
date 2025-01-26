import { getAppUrl } from "@/lib/helper/appUrl";
import prisma from "@/lib/prisma";
import { WorkflowStatus } from "@/types/workflow";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const now = new Date();
    const workflows = await prisma.workflow.findMany({
      select: { id: true },
      where: {
        status: WorkflowStatus.PUBLISHED,
        cron: { not: null },
        nextRunAt: { lte: now },
      },
    });

    for (const workflow of workflows) {
      triggerWorkflow(workflow.id);
    }

    return NextResponse.json({
      message: `Cron job executed successfully for length: ${workflows.length}`,
      success: true,
    });
  } catch (err) {
    console.error(err);
  }
}

function triggerWorkflow(workflowId: string) {
  // Trigger the workflow
  const triggerUrl = getAppUrl(
    `api/workflows/execute?workflowId=${workflowId}`
  );

  fetch(triggerUrl, {
    headers: {
      Authorization: `Bearer ${process.env.API_SECRET}`,
    },
    cache: "no-cache",
    // signal: AbortSignal.timeout(5000), // Optional timeout in ms
  }).catch((err) =>
    console.error(
      `Error triggering workflow with id ${workflowId}: ${err.message}`
    )
  );
}
