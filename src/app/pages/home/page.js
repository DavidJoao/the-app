"use client"
import Navbar from "@/app/components/Navbar"
import React, { useEffect, useState } from "react"
import useAuth from "@/app/hooks/useAuth"
import axios from "axios"
import { blockUsers, unblockUsers, deleteUsers } from "@/app/lib/actions/user"
import { logoutUser } from "@/app/lib/actions/session"
import { useRouter } from "next/navigation"

const Home = () => {
	const session = useAuth()
    const router = useRouter();

	const [users, setUsers] = useState(null)
    const [selectedUsers, setSelectedUsers] = useState([])
    const [allSelected, setAllSelected] = useState(false)

    const loadUsers = async () => {
		const res = await axios.get("/api/user/all").then(res => {
			setUsers(res?.data?.users)
		})
		return res
    }

    const handleSelect = (id, isChecked) => {
        setSelectedUsers((prevSelection) => {
            if (isChecked) {
                return [...prevSelection, id];
            } else {
                return prevSelection.filter((userId, index) => userId !== id)
            }
        })
    }

    const handleSelectAll = (isChecked) => {
        setAllSelected(isChecked)
        if (isChecked) {
            setSelectedUsers(users?.map((user) => user?.user_id));
        } else {
            setSelectedUsers([])
        }
    }

    const handleBlockUsers = async () => {
        await blockUsers(selectedUsers, session?.user?.email)
            .then(res => console.log(res))
            .catch(err => console.log(err))
        await loadUsers();
        if (selectedUsers.includes(session?.user?.user_id)) {
            await logoutUser();
        }
        setSelectedUsers([])
    }

    const handleUnblockUsers = async () => {
        await unblockUsers(selectedUsers, session?.user?.email)
            .then(res => console.log(res))
            .catch(err => console.log(err))
        await loadUsers();
        setSelectedUsers([])
    }

    const handleDeleteUsers = async () => {
        await deleteUsers(selectedUsers, session?.user?.email)
            .then(res => console.log(res))
            .catch(err => console.log(err))
        await loadUsers();
        if (selectedUsers.includes(session?.user?.user_id)) {
            await logoutUser();
        }
        setSelectedUsers([])
    }

    useEffect(() => {
        if (users) {
          setAllSelected(selectedUsers.length === users.length);
        }
      }, [selectedUsers, users]);

	useEffect(() => {
        loadUsers();
	}, [])

	return (
		<div className="bg-slate-200 flex flex-col h-screen">
			<Navbar user={session?.user} />
			<div className="p-3 mt-[50px]">
				<p className="sub-title">Dashboard</p>
				<div className="flex flex-col md:flex-row gap-4 mb-4 mt-4">
					<button className={selectedUsers?.length < 1 ? `inactive-button` : `bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 rounded`} disabled={selectedUsers?.length < 1 ? true : false} onClick={handleDeleteUsers}> Delete Users</button>
					<button className={selectedUsers?.length < 1 ? `inactive-button` : `bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded`} disabled={selectedUsers?.length < 1 ? true : false}  onClick={handleBlockUsers}>Block Users</button>
					<button className={selectedUsers?.length < 1 ? `inactive-button` : `bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded`} disabled={selectedUsers?.length < 1 ? true : false} onClick={handleUnblockUsers}>Unblock Users</button>
				</div>
				<div className="overflow-x-auto w-full">
					<table className="min-w-full bg-white rounded-lg shadow-md">
						<thead>
							<tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
								<th className="py-3 px-6 text-center">
									<input type="checkbox" checked={allSelected} onChange={(e) => handleSelectAll(e.target.checked)}/>
								</th>
								<th className="py-3 px-6 text-center">Name</th>
								<th className="py-3 px-6 text-center">Email</th>
								<th className="py-3 px-6 text-center">Last Login</th>
								<th className="py-3 px-6 text-center">Last Activity</th>
							</tr>
						</thead>
						<tbody className="text-gray-600 text-sm font-light">
							{users?.sort((a, b) => new Date(b.lastLogin) - new Date(a.lastLogin)).map((user, index) => (
								<tr key={index} className="border-b border-gray-200 hover:bg-gray-100 text-center">
									<td className="py-3 px-6">
										<input type="checkbox" checked={selectedUsers.includes(user?.user_id)} onChange={(e) => handleSelect(user?.user_id, e.target.checked)}/>
									</td>
									<td className={ user?.status === 'blocked' ? 'text-gray-300 line-through py-3 px-6' : "py-3 px-6"}>{user?.name}</td>
									<td className={ user?.status === 'blocked' ? 'text-gray-300 line-through py-3 px-6' : "py-3 px-6"}>{user?.email}</td>
									<td className={ user?.status === 'blocked' ? 'text-gray-300 line-through py-3 px-6' : "py-3 px-6"}>{user?.lastLogin}</td>
									<td className={ user?.status === 'blocked' ? 'text-gray-300 line-through py-3 px-6' : "py-3 px-6"}>{user?.lastActivity}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	)
}

export default Home
