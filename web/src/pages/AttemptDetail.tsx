import { Navigate, useParams } from 'react-router-dom';

export default function AttemptDetail() {
    const { id } = useParams();
    // In this architecture, /attempts/:id should seamlessly redirect to either practice or feedback based on state.
    // For simplicity, we push directly to feedback which contains the "Review / Retry / Back" actions.
    return <Navigate to={`/feedback/${id}`} replace />;
}
