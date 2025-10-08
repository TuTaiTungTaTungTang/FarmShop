import React, { useState } from 'react'
import axios from 'axios'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { server } from '../server'

const ResetPasswordPage = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const submitHandler = async (e) => {
    e.preventDefault()
    if (!password || !confirmPassword) return toast.error('Vui lòng nhập mật khẩu và xác nhận')
    if (password !== confirmPassword) return toast.error('Mật khẩu không khớp')
    setLoading(true)
    try {
      const { data } = await axios.post(`${server}/user/reset-password/${token}`, { password, confirmPassword }, { withCredentials: true })
      toast.success(data.message || 'Mật khẩu đã được đặt lại')
      navigate('/login')
    } catch (err) {
      // reset-password request failed
      toast.error(err?.response?.data?.message || 'Không thể đặt lại mật khẩu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4 text-center">Đặt lại mật khẩu</h2>
        <form onSubmit={submitHandler} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Mật khẩu mới</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 block w-full border px-3 py-2 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Xác nhận mật khẩu</label>
            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="mt-1 block w-full border px-3 py-2 rounded" />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded" disabled={loading}>{loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}</button>
        </form>
        <div className="mt-4 text-sm text-center">
          <Link to="/login" className="text-blue-600">Quay lại đăng nhập</Link>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordPage
