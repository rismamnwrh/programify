// @ts-ignore
import { InertiaLink, useForm, Head } from '@inertiajs/inertia-react';
import classNames from 'classnames';
import React from 'react';
import useRoute from '@/Hooks/useRoute';
import AuthenticationCard from '@Components/AuthenticationCard';
import Button from '@Components/Button';
import Checkbox from '@Components/Checkbox';
import Input from '@Components/Input';
import Label from '@Components/Label';
import ValidationErrors from '@Components/ValidationErrors';

interface Props {
  canResetPassword: boolean;
  status: string;
}

export default function Login({ canResetPassword, status }: Props) {
  const route = useRoute();
  const form = useForm({
    email: '',
    password: '',
    remember: '',
  });

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    form.post(route('login'), {
      onFinish: () => form.reset('password'),
    });
  }

  return (
    <AuthenticationCard>
      <Head title="login" />

      <ValidationErrors className="mb-4" />

      {status && (
        <div className="mb-4 font-medium text-sm text-green-600">{status}</div>
      )}

      <form onSubmit={onSubmit}>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            className="mt-1 block w-full"
            value={form.data.email}
            onChange={e => form.setData('email', e.currentTarget.value)}
            required
            autoFocus
          />
        </div>

        <div className="mt-4">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            className="mt-1 block w-full"
            value={form.data.password}
            onChange={e => form.setData('password', e.currentTarget.value)}
            required
            autoComplete="current-password"
          />
        </div>

        <div className="mt-4">
          <label className="flex items-center">
            <Checkbox
              name="remember"
              checked={form.data.remember === 'on'}
              onChange={e =>
                form.setData('remember', e.currentTarget.checked ? 'on' : '')
              }
            />
            <span className="ml-2 text-sm text-gray-600">Remember me</span>
          </label>
        </div>

        <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0 mt-4">
          {canResetPassword && (
            <div>
              <InertiaLink
                href={route('password.request')}
                className="underline text-sm text-gray-600 hover:text-gray-900"
              >
                Forgot your password?
              </InertiaLink>
            </div>
          )}

          <div className="flex items-center justify-end">
            <InertiaLink
              href={route('register')}
              className="underline text-sm text-gray-600 hover:text-gray-900"
            >
              Need an account?
            </InertiaLink>

            <Button
              className={classNames('ml-4', { 'opacity-25': form.processing })}
              disabled={form.processing}
            >
              Log in
            </Button>
          </div>
        </div>
      </form>
    </AuthenticationCard>
  );
}