"use client"
import Navbar from "@/app/components/Navbar"
import React, { useEffect, useState } from "react"
import useAuth from "@/app/hooks/useAuth"
import axios from "axios"

const Home = () => {

	const session = useAuth()

  const [users, setUsers] = useState(null)

  useEffect(() => {
    axios.get('/api/user/all')
      .then(res => {
        setUsers(res?.data?.users)
      })
      return
  }, [])

	return (
		<div className="bg-slate-200 flex flex-col h-screen">
			<Navbar user={session?.user}/>
			<div className="p-3 mt-[50px]">
				<p className="sub-title">Dashboard</p>
				<table>
					<thead>
						<tr>
              <th></th>
              <th>Name</th>
              <th>Email</th>
              <th>Last Login</th>
              <th>Last Activity</th>
						</tr>
					</thead>
					<tbody>
          { users?.map((user, index) => {
            return (
              <tr key={index}>
                    <input type="checkbox"/>
                    <td>{user?.name}</td>
                    <td>{user?.email}</td>
                    <td>{user?.lastLogin}</td>
                    <td>{user?.lastActivity}</td>
                 </tr>
                )
              })}
					</tbody>
				</table>
			</div>
		</div>
	)
}

export default Home
