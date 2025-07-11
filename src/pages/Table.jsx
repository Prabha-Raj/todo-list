import React from 'react'
const data = [
    { "id": 1, "name": "Amit", "email": "amit@example.com" },
    { "id": 2, "name": "Sara", "email": "sara@example.com" }
];

const Table = () => {
    return (
        <div>

            <table className='table-fixed border-1 border-collapse border-grey-500 py-2 px-5'>
  <caption class="caption-top">
    Table for dispaly given data
  </caption>
                <thead>
                    <tr>
                        <th className='border border-grey-500 py-2 px-5'>ID</th>
                        <th className='border border-grey-500 py-2 px-5'>Name</th>
                        <th className='border border-grey-500 py-2 px-5'>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((item) => (
                            <tr key={item.id}>
                                <td className='border border-grey-500 py-2 px-5'>{item.id}</td>
                                <td className='border border-grey-500 py-2 px-5'>{item.name}</td>
                                <td className='border border-grey-500 py-2 px-5'>{item.email}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default Table
