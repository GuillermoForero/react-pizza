import { Link, useNavigate } from 'react-router-dom';

function LinkButton({ children, to }) {
  const navigate = useNavigate();
  const className =
    'text-sm text-blue-500 transition-colors duration-300 hover:text-blue-600';
  if (to === -1) {
    return (
      <button onClick={() => navigate(-1)} className={className}>
        {children}
      </button>
    );
  }
  return (
    <Link className={className} to={to}>
      {children}
    </Link>
  );
}

export default LinkButton;
