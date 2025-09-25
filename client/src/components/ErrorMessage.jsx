function ErrorMessage({ error }) {
  return (
        <div className="error-block">
          <p>{error.message ?? 'Server error'}</p>
        </div>
      );
}

export default ErrorMessage;