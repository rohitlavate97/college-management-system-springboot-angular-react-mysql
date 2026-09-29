import { useForm } from 'react-hook-form';

export const LoginPage = () => {
  const { register, handleSubmit } = useForm();
  const onSubmit = (data: any) => console.log(data);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded shadow-md w-96">
        <h2 className="mb-4 text-2xl font-bold">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-sm font-medium">Email</label>
            <input type="email" {...register("email")}  className="w-full px-3 py-2 border rounded" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Password</label>
            <input type="password" {...register("password")}  className="w-full px-3 py-2 border rounded" />
          </div>
          <button type="submit" className="w-full py-2 text-white bg-blue-600 rounded">Login</button>
        </form>
      </div>
    </div>
  );
};
