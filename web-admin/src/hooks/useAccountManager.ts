import { useState, useEffect } from 'react';
import { accountService } from '../services/account.service';
import type { StaffAccount, AccountFormData } from '../types/account.type';

export const useAccountManager = () => {
  // --- STATE QUẢN LÝ DỮ LIỆU ---
  const [staffList, setStaffList] = useState<StaffAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // --- STATE QUẢN LÝ MODAL & FORM ---
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // State cho Chi tiết
  const [selectedAccount, setSelectedAccount] = useState<StaffAccount | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // State cho Chỉnh sửa
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const initialFormState: AccountFormData = {
    tenTaiKhoan: '', hoVaTen: '', email: '', soDienThoai: '',
    loaiTaiKhoan: 'BAC_SI', matKhau: '', xacNhanMatKhau: '',
    chuyenKhoa: '', congTac: '', chungChi: ''
  };

  const [formData, setFormData] = useState<AccountFormData>(initialFormState);

  // --- LOGIC API ---
  const fetchStaff = async () => {
    try {
      setLoading(true);
      const data = await accountService.getAllStaff();
      setStaffList(data);
    } catch (error) {
      console.error("Lỗi tải danh sách:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // --- HANDLERS (Xử lý sự kiện) ---

  // 1. Xem chi tiết
  const handleViewDetail = async (staff: StaffAccount) => {
    setSelectedAccount(staff); // Hiển thị data cơ bản trước cho mượt
    setShowDetailModal(true);
    setDetailLoading(true);
    try {
      const fullDetail = await accountService.getAccountDetail(staff.maTaiKhoan);
      setSelectedAccount(fullDetail);
    } catch (error) {
      console.error("Lỗi tải chi tiết:", error);
    } finally {
      setDetailLoading(false);
    }
  };

  // 2. Xử lý Submit Form (Tạo mới / Cập nhật)
  const handleSubmitAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate cơ bản
    if (!formData.tenTaiKhoan || !formData.hoVaTen) return alert("Thiếu thông tin bắt buộc!");
    if (!isEditing && !formData.matKhau) return alert("Nhập mật khẩu!");
    if (formData.matKhau && formData.matKhau !== formData.xacNhanMatKhau) return alert("Mật khẩu không khớp!");

    try {
      setSubmitting(true);
      const { xacNhanMatKhau, ...payload } = formData; // Loại bỏ xacNhanMatKhau trước khi gửi

      if (isEditing && editingId) {
        await accountService.updateAccount(editingId, payload);
        alert("Cập nhật thành công!");
      } else {
        await accountService.createAccount(payload);
        alert("Tạo mới thành công!");
      }
      setShowModal(false);
      fetchStaff(); // Load lại danh sách
    } catch (error: any) {
      alert(error.response?.data?.message || 'Lỗi xử lý.');
    } finally {
      setSubmitting(false);
    }
  };

  // 3. Xóa tài khoản
  const handleDeleteAccount = async (id: number, name: string) => {
    if (!window.confirm(`Xóa tài khoản ${name}?`)) return;
    try {
      await accountService.deleteAccount(id);
      alert("Đã xóa!");
      fetchStaff();
    } catch (error) {
      alert("Lỗi xóa tài khoản.");
    }
  };

  // --- HELPERS (Hàm phụ trợ) ---
  const openCreateModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData(initialFormState);
    setShowModal(true);
  };

  const openEditModal = (staff: StaffAccount) => {
    setIsEditing(true);
    setEditingId(staff.maTaiKhoan);
    
    setFormData({
      tenTaiKhoan: staff.tenTaiKhoan,
      hoVaTen: staff.hoVaTen,
      email: staff.email || '',
      soDienThoai: staff.soDienThoai || '',
      loaiTaiKhoan: staff.loaiTaiKhoan,
      matKhau: '',
      xacNhanMatKhau: '',

      chuyenKhoa: staff.BacSi?.chuyenKhoa || '',
      congTac: staff.BacSi?.congTac || '',
      chungChi: staff.KyThuatVien?.chungChi || ''
    });
    setShowModal(true);
  };

  // Logic lọc danh sách theo từ khóa tìm kiếm
  const filteredStaff = staffList.filter(s => 
    s.hoVaTen.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.tenTaiKhoan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    // Data
    staffList, loading, filteredStaff,
    selectedAccount, detailLoading,
    
    // Form State
    formData, setFormData, searchTerm, setSearchTerm,
    showModal, setShowModal, showDetailModal, setShowDetailModal,
    submitting, isEditing,

    // Actions
    handleViewDetail,
    handleSubmitAccount,
    handleDeleteAccount,
    openCreateModal,
    openEditModal
  };
};