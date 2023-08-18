import create from 'zustand'

const mockFetchUser = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: ''
        }
      })
    }, 1000)
  })
}

export const useUserStore = create((set:any) => ({
  user: {},
  loading: false,
  fetchUsers: async () => {
    const res = await mockFetchUser()
    // const res = await fetch(`http://localhost:3008/api/users/me`,{cache:'no-cache'})
    const json = (await (res as any).json()).data
    const payload = { users: json, loading: false }
    set(payload)
  },
  // createUser: async (user) => {
  //   const res = await fetch(`http://localhost:3008/api/users`, {
  //     cache: 'no-cache',
  //     method: 'post',
  //     headers: { 'content-type': 'application/json' },
  //     body: JSON.stringify({ ...user })
  //   })
  //   const json = await res.json()
  //   set({ user: json.data })
  // },
  // updateUser: async (user) => {
  //   const res = await fetch(`http://localhost:3008/api/users/me`, {
  //     cache: 'no-cache',
  //     method: 'put',
  //     headers: { 'content-type': 'application/json' },
  //     body: JSON.stringify({ ...user })
  //   })
  //   const json = await res.json()
  //   set({ user: json.data })
  // },
}))
