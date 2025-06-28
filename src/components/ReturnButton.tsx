interface ReturnButtonProps {
  onReturn: () => void;
  disabled?: boolean;
}

export function ReturnButton({ onReturn, disabled }: ReturnButtonProps) {
  return (
    <button
      type="button"
      className="btn btn-success"
      disabled={disabled}
      onClick={onReturn}
      data-cy="return-button"
    >
      Return to Origin
    </button>
  );
}
