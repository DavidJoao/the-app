"use client"
import Navbar from "@/app/components/Navbar"
import React, { useEffect, useState } from "react"
import useAuth from "@/app/hooks/useAuth"
import axios from "axios"
import { blockUsers, unblockUsers, deleteUsers, getStatus } from "@/app/lib/actions/user"
import { logoutUser } from "@/app/lib/actions/session"
import { useRouter } from "next/navigation"
import ReactTimeago from "react-timeago"
import { block, spinner, trash, unblock } from "@/app/lib/icons"
import { useAppContext } from "@/app/components/context/provider"
import Tooltip from "@/app/components/Tooltip"


const Home = () => {

    const { appNotification, setAppNotification } = useAppContext()

	const session = useAuth()
    const router = useRouter();

	const [users, setUsers] = useState(null)
    const [selectedUsers, setSelectedUsers] = useState([])
    const [allSelected, setAllSelected] = useState(false)
    const [filter, setFilter] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [loadingMessage, setLoadingMessage] = useState("Performing Action, Please Wait...")

    const addLoadingMessage = () => {
        setLoadingMessage("Performing Action, Please Wait...")
        setIsLoading(true)
    }
    const removeLoadingMessage = () => {
        setLoadingMessage("✓ Action Performed Successfully ✓")
        setTimeout(() => {
            setIsLoading(false)
        }, 2000)
    }

    const removeErrorMessage = () => {
        setLoadingMessage("Error Performing Action: Contact Developer")
        setTimeout(() => {
            setIsLoading(false)
        }, 2000)
    }

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
    
    const handleUnblockUsers = async () => {
        const statusResponse = await getStatus(session?.user?.email)
        if (statusResponse === 'active') {
            addLoadingMessage()
            await unblockUsers(selectedUsers, session?.user?.email)
            .then(res => {
                removeLoadingMessage()
            })
            .catch(err => {
                console.log(err)
                removeErrorMessage()
            })
            await loadUsers();
            setSelectedUsers([])
        } else {
            statusResponse === 'blocked' ? setAppNotification('Your account has been blocked!') : statusResponse === 'deleted' ? setAppNotification('Your account has been deleted!') : setAppNotification('');
            await logoutUser()
        }
    }

    const handleBlockUsers = async () => {
        addLoadingMessage()
        const statusResponse = await getStatus(session?.user?.email)
        if (statusResponse === 'active') {
            await blockUsers(selectedUsers, session?.user?.email)
                .then(res => {
                    console.log(res)
                    removeLoadingMessage()
                    
                })
                .catch(err => {
                    console.log(err.response)
                    removeErrorMessage()
                })
            await loadUsers();
            setSelectedUsers([])
        } else {
            statusResponse === 'blocked' ? setAppNotification('Your account has been blocked!') : statusResponse === 'deleted' ? setAppNotification('Your account has been deleted!') : setAppNotification('');
            logoutUser()
        }
    }
    
    const handleDeleteUsers = async () => {
        addLoadingMessage()
        const statusResponse = await getStatus(session?.user?.email)
        console.log(statusResponse)
        if (statusResponse === 'active') {
            await deleteUsers(selectedUsers, session?.user?.email)
                .then(res => {
                    console.log(res)
                    removeLoadingMessage()
                })
                .catch(err => {
                    console.log(err)
                    removeErrorMessage()
                })
            await loadUsers();
            setSelectedUsers([])
        } else {
            statusResponse === 'blocked' ? setAppNotification('Your account has been blocked!') : statusResponse === 'deleted' ? setAppNotification('Your account has been deleted!') : setAppNotification('');
            logoutUser()
        }
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
		<div className={ isLoading ? "bg-slate-200 flex flex-col h-screen items-center justify-center" : "bg-slate-200 flex flex-col h-screen"}>
            { isLoading ? (
                <div className="flex flex-col items-center justify-center gap-5">
                    <p>{spinner}</p>
                    <p>{loadingMessage}</p>
                </div>
            ) : (
                <>
                <Navbar user={session?.user} />
                <div className="p-3 mt-[50px]">
                    <p className="sub-title">Dashboard</p>
                    <div className="flex flex-col md:flex-row gap-4 mb-4 mt-4">
                        <button className={selectedUsers?.length < 1 ? `inactive-button centered` : `bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 rounded centered`} disabled={selectedUsers?.length < 1 ? true : false} onClick={handleDeleteUsers}> {trash} </button>
                        <button className={selectedUsers?.length < 1 ? `inactive-button centered` : `flex flex-row bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded centered`} disabled={selectedUsers?.length < 1 ? true : false}  onClick={handleBlockUsers}>Block {block}</button>
                        <button className={selectedUsers?.length < 1 ? `inactive-button centered` : `bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded centered`} disabled={selectedUsers?.length < 1 ? true : false} onClick={handleUnblockUsers}>{unblock}</button>
                        <input className="input w-full md:w-[200px]" placeholder="Filter by name, email" onChange={(e) => setFilter(e.target.value)}/>
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
                                {users?.filter((user) => filter === "" || user?.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase()) || user?.email.toLocaleLowerCase().includes(filter.toLocaleLowerCase()))
                                .sort((a, b) => new Date(b.lastLogin) - new Date(a.lastLogin)).map((user, index) => (
                                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-100 text-center">
                                        <td className="py-3 px-6">
                                            <input type="checkbox" checked={selectedUsers.includes(user?.user_id)} onChange={(e) => handleSelect(user?.user_id, e.target.checked)}/>
                                        </td>
                                        <td className={ user?.status === 'blocked' ? 'text-gray-300 line-through py-3 px-6' : "py-3 px-6"}>{user?.name}</td>
                                        <td className={ user?.status === 'blocked' ? 'text-gray-300 line-through py-3 px-6' : "py-3 px-6"}>{user?.email}</td>
                                        <td>
                                            <Tooltip text={new Date(user?.lastLogin).toLocaleString()}>
                                                <ReactTimeago className={ user?.status === 'blocked' ? 'text-gray-300 line-through py-3 px-6' : "py-3 px-6"} date={user?.lastLogin}/>
                                            </Tooltip>
                                        </td>
                                        <td>
                                            <Tooltip text={new Date(user?.lastActivity).toLocaleString()}>
                                                <ReactTimeago className={ user?.status === 'blocked' ? 'text-gray-300 line-through py-3 px-6' : "py-3 px-6"} date={user?.lastActivity}/>
                                            </Tooltip>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                </>
            ) }
		</div>
	)
}

export default Home
