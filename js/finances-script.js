import { isLoggedIn, getStudentInfo } from "../lib/supabase-auth.js";
import { showSignOutModal } from "../lib/pop-up.js";
import { setTheme } from "../lib/theme.js";
import { supabase } from "../config/supabase.js";

const logOutBtn = document.getElementById("sign-out");

document.addEventListener("DOMContentLoaded", () => {
  initializeSidebar();
  loadFinances();
  setupNavigation();
});

function initializeSidebar() {
  const menuToggle = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebarOverlay");

  const isMobile = () => window.innerWidth <= 768;

  menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
  });

  overlay.addEventListener("click", () => {
    if (isMobile()) {
      sidebar.classList.add("collapsed");
    }
  });

  window.addEventListener("resize", () => {
    if (!isMobile()) {
      sidebar.classList.remove("collapsed");
    } else {
      sidebar.classList.add("collapsed");
    }
  });

  if (isMobile()) {
    sidebar.classList.add("collapsed");
  } else {
    sidebar.classList.remove("collapsed");
  }
}

function setupNavigation() {
  document.querySelector(".nav-item:not(.active):not(.sign-out)")?.addEventListener("click", () => {
    window.location.href = "../pages/dashboard.html";
  });

  document.querySelector(".nav-item.courses")?.addEventListener("click", () => {
    window.location.href = "../pages/courses.html";
  });

  document.querySelector(".nav-item.schedule")?.addEventListener("click", () => {
    window.location.href = "../pages/schedule.html";
  });

  document.querySelector(".nav-item.resources")?.addEventListener("click", () => {
    window.location.href = "../pages/resources.html";
  });

  document.querySelector(".nav-item.events")?.addEventListener("click", () => {
    window.location.href = "../pages/events.html";
  });

  document.querySelector(".nav-item.settings")?.addEventListener("click", () => {
    window.location.href = "../pages/settings.html";
  });
}

async function loadFinances() {
  try {
    // Get student info
    const studentResult = await getStudentInfo();
    
    if (!studentResult.success || !studentResult.student) {
      showError("Unable to load your information");
      return;
    }

    const studentId = studentResult.student.student_id;
    
    // Set payment reference
    document.getElementById('paymentReference').textContent = studentId;

    // Load all finance data
    await Promise.all([
      loadAccountSummary(studentId),
      loadFeeBreakdown(studentId),
      loadPaymentHistory(studentId)
    ]);

  } catch (error) {
    console.error('Error loading finances:', error);
    showError("Failed to load finance information");
  }
}

async function loadAccountSummary(studentId) {
  try {
    const { data, error } = await supabase
      .from('student_finances')
      .select('*')
      .eq('student_id', studentId)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      // No finance record yet
      document.getElementById('totalFees').textContent = 'R 0.00';
      document.getElementById('totalPaid').textContent = 'R 0.00';
      document.getElementById('outstandingBalance').textContent = 'R 0.00';
      document.getElementById('dueDate').textContent = 'No fees recorded yet';
      return;
    }

    // Update summary cards
    document.getElementById('totalFees').textContent = formatCurrency(data.total_fees);
    document.getElementById('totalPaid').textContent = formatCurrency(data.total_paid);
    document.getElementById('outstandingBalance').textContent = formatCurrency(data.outstanding_balance);
    
    // Update due date
    if (data.due_date) {
      const dueDate = new Date(data.due_date);
      document.getElementById('dueDate').textContent = `Due: ${dueDate.toLocaleDateString('en-ZA')}`;
    } else {
      document.getElementById('dueDate').textContent = 'No due date set';
    }

  } catch (error) {
    console.error('Error loading account summary:', error);
    showError("Failed to load account summary");
  }
}

async function loadFeeBreakdown(studentId) {
  const container = document.getElementById('feeBreakdownContainer');
  
  try {
    const { data: fees, error } = await supabase
      .from('fee_breakdown')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    if (!fees || fees.length === 0) {
      container.innerHTML = '<div class="no-data">No fee breakdown available</div>';
      return;
    }

    // Render fee items
    container.innerHTML = '';
    fees.forEach(fee => {
      const feeItem = document.createElement('div');
      feeItem.className = 'fee-item';
      
      feeItem.innerHTML = `
        <div class="fee-item-info">
          <h4>${fee.fee_type}</h4>
          <p>${fee.description || 'No description'}</p>
        </div>
        <div class="fee-item-amount">${formatCurrency(fee.amount)}</div>
      `;
      
      container.appendChild(feeItem);
    });

  } catch (error) {
    console.error('Error loading fee breakdown:', error);
    container.innerHTML = '<div class="error">Failed to load fee breakdown</div>';
  }
}

async function loadPaymentHistory(studentId) {
  const tbody = document.getElementById('paymentHistoryTable');
  
  try {
    const { data: payments, error } = await supabase
      .from('payment_history')
      .select('*')
      .eq('student_id', studentId)
      .order('payment_date', { ascending: false });

    if (error) throw error;

    if (!payments || payments.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="no-data">No payment history yet</td></tr>';
      return;
    }

    // Render payment history
    tbody.innerHTML = '';
    payments.forEach(payment => {
      const row = document.createElement('tr');
      
      const paymentDate = new Date(payment.payment_date);
      
      row.innerHTML = `
        <td>${paymentDate.toLocaleDateString('en-ZA')}</td>
        <td class="payment-amount">${formatCurrency(payment.amount)}</td>
        <td><span class="payment-method">${payment.payment_method}</span></td>
        <td>${payment.reference_number}</td>
        <td>${payment.description || '-'}</td>
      `;
      
      tbody.appendChild(row);
    });

  } catch (error) {
    console.error('Error loading payment history:', error);
    tbody.innerHTML = '<tr><td colspan="5" class="error">Failed to load payment history</td></tr>';
  }
}

function formatCurrency(amount) {
  if (amount === null || amount === undefined) return 'R 0.00';
  return 'R ' + parseFloat(amount).toLocaleString('en-ZA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function showError(message) {
  console.error(message);
  // You can add a toast notification here if you want
}

logOutBtn.addEventListener("click", () => {
  showSignOutModal();
});

window.addEventListener("load", async () => {
  let currTheme = localStorage.getItem("theme");
  if (!currTheme) {
    currTheme = "light";
  }
  setTheme(currTheme);
  
  const loggedIn = await isLoggedIn();
  if (!loggedIn) {
    location.href = "../index.html";
  }
});
