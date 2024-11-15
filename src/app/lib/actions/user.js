import axios from "axios"

export async function updateLastLogin ( email ) {
    await axios.patch(`/api/user/lastLogin/${email}`)
        .then(res => console.log(res))
        .catch(err => console.log(err))
}