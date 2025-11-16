import { supabase } from "../config/supabase.js";
import { getStudentInfo } from "./supabase-auth.js";

// Load unread notification count and update badge
export async function loadNotificationCount() {
  try {
    const studentResult = await getStudentInfo(false); // Don't show loading overlay
    if (!studentResult.success || !studentResult.studentInfo) {
      return;
    }

    const currentStudent = studentResult.studentInfo;
    const studentYear = `year-${currentStudent.year}`;

    // Fetch announcements
    const { data: announcements, error } = await supabase
      .from('announcements')
      .select('id')
      .eq('is_active', true)
      .or(`target_audience.eq.all,target_audience.eq.${studentYear}`);

    if (error) throw error;

    if (!announcements || announcements.length === 0) {
      updateBadge(0);
      return;
    }

    // Fetch read status
    const { data: reads, error: readsError } = await supabase
      .from('announcement_reads')
      .select('announcement_id')
      .eq('student_id', currentStudent.student_id);

    if (readsError) throw readsError;

    const readIds = new Set(reads?.map(r => r.announcement_id) || []);
    const unreadCount = announcements.length - readIds.size;

    updateBadge(unreadCount);

  } catch (error) {
    console.error('Error loading notification count:', error);
  }
}

function updateBadge(count) {
  const badge = document.getElementById('notificationBadge');
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'block' : 'none';
  }
}
