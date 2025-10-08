import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { server } from '../server'
import { Link } from 'react-router-dom'

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const submitHandler = async (e) => {
    e.preventDefault()
    if (!email) return toast.error('Vui lòng nhập email')
    setLoading(true)
    try {
      const { data } = await axios.post(`${server}/user/forgot-password`, { email }, { withCredentials: true })
      toast.success(data.message || 'Vui lòng kiểm tra email để nhận liên kết đặt lại mật khẩu')
    } catch (err) {
      // forgot-password request failed
      toast.error(err?.response?.data?.message || 'Yêu cầu không thành công')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4 text-center">Quên mật khẩu</h2>
        <form onSubmit={submitHandler} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full border px-3 py-2 rounded"
              placeholder="Nhập email của bạn"
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded" disabled={loading}>
            {loading ? 'Đang gửi...' : 'Gửi liên kết đặt lại'}
          </button>
        </form>
        <div className="mt-4 text-sm text-center">
          <Link to="/login" className="text-blue-600">Quay lại đăng nhập</Link>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
