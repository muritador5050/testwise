// components/RegisterForm.tsx
import React, { useState } from 'react';
import { useRegisterUser, RegisterUserData } from '../hooks/useRegisterUser';

export const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<
    Omit<RegisterUserData, 'avatar'> & { avatar: File | null }
  >({
    email: '',
    name: '',
    avatar: null,
    role: 'user',
    password: '',
  });

  const registerMutation = useRegisterUser();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (file: File | null) => {
    setFormData((prev) => ({ ...prev, avatar: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.avatar) {
      alert('Please select an avatar');
      return;
    }

    try {
      await registerMutation.mutateAsync({
        ...formData,
        avatar: formData.avatar, // This will be uploaded to Cloudinary
      } as RegisterUserData);

      // Registration successful
      alert('Registration successful!');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='register-form'>
      <div className='form-group'>
        <label>Avatar</label>
        <AvatarUpload
          onAvatarChange={handleAvatarChange}
          disabled={registerMutation.isPending}
        />
      </div>

      <div className='form-group'>
        <label>Name</label>
        <input
          type='text'
          name='name'
          value={formData.name}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className='form-group'>
        <label>Email</label>
        <input
          type='email'
          name='email'
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className='form-group'>
        <label>Password</label>
        <input
          type='password'
          name='password'
          value={formData.password}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className='form-group'>
        <label>Role</label>
        <select name='role' value={formData.role} onChange={handleInputChange}>
          <option value='user'>User</option>
          <option value='admin'>Admin</option>
        </select>
      </div>

      <button
        type='submit'
        disabled={registerMutation.isPending || !formData.avatar}
      >
        {registerMutation.isPending ? 'Registering...' : 'Register'}
      </button>

      {registerMutation.isError && (
        <div className='error-message'>{registerMutation.error.message}</div>
      )}
    </form>
  );
};
