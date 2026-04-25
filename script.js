// ================= 1. ระบบจัดการหน้าเว็บ (SPA) =================
function changePage(pageId) {
    // ซ่อนทุกหน้า
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
        setTimeout(() => section.classList.add('hidden'), 50); // ดีเลย์นิดนึงให้แอนิเมชันทำงาน
    });
    
    // โชว์หน้าที่กด
    const target = document.getElementById(pageId);
    target.classList.remove('hidden');
    setTimeout(() => target.classList.add('active'), 50);
    window.scrollTo(0, 0); // เลื่อนขึ้นบนสุด
}

// ================= 2. ระบบ Modal ต่างๆ =================
function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

// Modal เล็กดูตัวอย่างลิงก์
function openLinkModal(title, url) {
    document.getElementById('link-title').innerText = "ดูตัวอย่าง: " + title;
    document.getElementById('link-url').href = url;
    document.getElementById('link-modal').classList.remove('hidden');
}

// Modal ขยายรูป
function openImageModal(imgSrc) {
    document.getElementById('zoomed-image').src = imgSrc;
    document.getElementById('image-modal').classList.remove('hidden');
}

// Modal ล็อกอินแอดมิน
function openAdminModal() {
    if (document.body.classList.contains('is-admin')) {
        // ถ้าเป็นแอดมินอยู่แล้ว กดอีกทีคือออกจากระบบ
        if(confirm("ต้องการออกจากโหมดแอดมินใช่ไหม?")) {
            document.body.classList.remove('is-admin');
            alert("ออกจากระบบแอดมินแล้วค่ะ");
        }
        return;
    }
    document.getElementById('admin-error').classList.add('hidden');
    document.getElementById('admin-password').value = '';
    document.getElementById('admin-modal').classList.remove('hidden');
}

// ================= 3. ระบบ Admin & อัปโหลดรูป =================
const ADMIN_PASSWORD = "ss11";
let currentEditImageId = null;

function checkPassword() {
    const pass = document.getElementById('admin-password').value;
    if (pass === ADMIN_PASSWORD) {
        document.body.classList.add('is-admin');
        closeModal('admin-modal');
        alert("เข้าสู่ระบบแอดมินสำเร็จ! ✨ ตอนนี้คุณสามารถกดปุ่ม 'แก้ไขรูป' ที่มุมของแต่ละรูปได้แล้วค่ะ");
    } else {
        document.getElementById('admin-error').classList.remove('hidden');
    }
}

// เมื่อแอดมินกดปุ่มแก้ไขรูป
function triggerUpload(imgId) {
    currentEditImageId = imgId;
    document.getElementById('image-uploader').click(); // เปิดหน้าต่างเลือกไฟล์
}

// จัดการเมื่อเลือกรูปเสร็จ
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file && currentEditImageId) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const dataURL = e.target.result;
            // 1. เปลี่ยนรูปในหน้าเว็บทันที
            document.getElementById(currentEditImageId).src = dataURL;
            // 2. บันทึกรูปลง Local Storage เพื่อให้รีเฟรชแล้วรูปไม่หาย (จำลองระบบดาต้าเบส)
            localStorage.setItem(currentEditImageId, dataURL);
        }
        reader.readAsDataURL(file);
    }
}

// เมื่อเปิดเว็บขึ้นมา ให้โหลดรูปที่เคยเซฟไว้ขึ้นมาโชว์
window.onload = function() {
    // หา <img> ทั้งหมดที่มี id เริ่มด้วย img-
    const images = document.querySelectorAll('img[id^="img-"]');
    images.forEach(img => {
        const savedData = localStorage.getItem(img.id);
        if (savedData) {
            img.src = savedData; // ถ้ามีข้อมูลในเครื่องให้เอารูปนั้นมาโชว์
        }
    });
}
