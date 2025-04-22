// pages/api/registration/update-status.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { id, status } = req.body

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ success: false, error: 'Invalid status' })
  }

  const { error } = await supabase
    .from('Registration')
    .update({ status })
    .eq('id', id)

  if (error) {
    console.error(error)
    return res.status(500).json({ success: false, error: error.message })
  }

  return res.status(200).json({ success: true })
}
