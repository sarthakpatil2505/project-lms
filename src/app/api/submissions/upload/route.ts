import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createHash } from 'crypto';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const assignmentId = formData.get('assignmentId') as string;
  const submissionText = formData.get('submissionText') as string | null;
  const codeContent = formData.get('codeContent') as string | null;

  if (!assignmentId) {
    return NextResponse.json({ error: 'assignmentId required' }, { status: 400 });
  }

  // Check deadline
  const { data: assignment } = await supabase
    .from('assignments')
    .select('deadline_at, max_score')
    .eq('id', assignmentId)
    .single();

  if (assignment?.deadline_at && new Date() > new Date(assignment.deadline_at)) {
    return NextResponse.json({ error: 'Submission deadline has passed.' }, { status: 403 });
  }

  let fileUrl: string | undefined;
  let fileName: string | undefined;
  let fileHash: string | undefined;

  if (file) {
    // Compute SHA-256 hash of file
    const buffer = await file.arrayBuffer();
    const hashHex = createHash('sha256').update(Buffer.from(buffer)).digest('hex');
    fileHash = hashHex;
    fileName = file.name;

    // Upload to Supabase Storage
    const storagePath = `submissions/${user.id}/${assignmentId}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('assignment-submissions')
      .upload(storagePath, file, { upsert: false });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: urlData } = supabase.storage
      .from('assignment-submissions')
      .getPublicUrl(storagePath);
    fileUrl = urlData.publicUrl;
  } else if (codeContent) {
    // Hash the code content
    fileHash = createHash('sha256').update(codeContent).digest('hex');
    fileName = 'code_submission.txt';
  }

  const textPayload = submissionText || codeContent || undefined;

  // Save submission record
  const { data: submission, error: dbError } = await supabase
    .from('assignment_submissions')
    .insert({
      assignment_id: assignmentId,
      student_id: user.id,
      file_url: fileUrl,
      file_name: fileName,
      file_hash: fileHash,
      submission_text: textPayload,
      status: 'submitted',
    })
    .select('id, submitted_at, file_hash')
    .single();

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    submissionId: submission.id,
    submittedAt: submission.submitted_at,
    fileHash: submission.file_hash,
  });
}
