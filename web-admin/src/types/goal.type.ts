export interface GoalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>; // Hàm xử lý khi submit
  submitting: boolean;
}