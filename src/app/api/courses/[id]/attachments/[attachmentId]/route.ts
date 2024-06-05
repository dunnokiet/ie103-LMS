import { db } from "@/db";
import { attachments, courses } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq, and, param } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(req: Request, { params }: { params: { id: any, attachmentId: any } }) {
    try {
        const supabase = createClient();

        const { data: { user }, } = await supabase.auth.getUser();

        if (!user)
            return new NextResponse("Unthorized", { status: 401 })

        const course = await db.query.courses.findFirst({
            where: and(eq(courses.id, params.id), eq(courses.userId, user.id)),
        });

        if (!course)
            return new NextResponse("Unthorized", { status: 401 })

        const attachment = await db.delete(attachments).where(and(eq(attachments.courseId, params.id), eq(attachments.id, params.attachmentId)))

        return NextResponse.json(attachment);
    } catch (error) {
        console.log("[COURSE_ID_ATTACHMENTS]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}