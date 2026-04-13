import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginRequest } from '../api/auth';
import { setCredentials } from '../store/authSlice';

const schema = Yup.object({
  email: Yup.string().email('Enter a valid email').required('Email is required'),
  password: Yup.string().min(6, 'At least 6 characters').required('Password is required'),
});

const initialValues = { email: '', password: '' };

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');

  return (
    <div className="auth-shell">
      <div className="card auth-card">
        <h1>Sign in</h1>
        <p className="muted">Use the seeded account from the documentation.</p>
        {apiError && <div className="alert error">{apiError}</div>}
        <Formik
          initialValues={initialValues}
          validationSchema={schema}
          onSubmit={async (values, { setSubmitting }) => {
            setApiError('');
            try {
              const data = await loginRequest(values);
              dispatch(setCredentials({ token: data.token, user: data.user }));
              navigate('/products', { replace: true });
            } catch (err) {
              const msg = err.response?.data?.error || 'Login failed';
              setApiError(msg);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="form">
              <label className="label" htmlFor="email">
                Email
              </label>
              <Field id="email" name="email" type="email" className="input" autoComplete="username" />
              <ErrorMessage name="email" component="div" className="field-error" />

              <label className="label" htmlFor="password">
                Password
              </label>
              <Field
                id="password"
                name="password"
                type="password"
                className="input"
                autoComplete="current-password"
              />
              <ErrorMessage name="password" component="div" className="field-error" />

              <button type="submit" className="btn primary full" disabled={isSubmitting}>
                {isSubmitting ? 'Signing in…' : 'Sign in'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
