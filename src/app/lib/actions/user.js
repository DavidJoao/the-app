import axios from "axios"

export async function updateLastLogin ( email ) {
    const res = await axios.patch(`/api/user/lastLogin/${email}`)
    return res;
}

export async function updateLastActivity ( email ) {
    const res = await axios.patch(`/api/user/lastActivity/${email}`)
    return res;
}

export async function deleteUsers ( users, email ) {
    await updateLastActivity(email)
    await axios.delete('/api/user/delete', { headers: { "Content-Type": "application/json" }, data: users })
    .then(res => console.log(res))
    .catch(err => console.log(err))
}

export async function blockUsers ( users, email ) {
    await updateLastActivity(email)
    await axios.patch('/api/user/block', users, { headers: { "Content-Type": "application/json" } })
        .then(res => console.log(res))
        .catch(err => console.log(err))
}

export async function unblockUsers ( users, email ) {
    await updateLastActivity(email)
    await axios.patch('/api/user/unblock', users, { headers: { "Content-Type": "application/json" } })
        .then(res => console.log(res))
        .catch(err => console.log(err))
}