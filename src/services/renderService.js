// export const updateRenderEnvVars = async (envVarKeyValue) => {
//     const res = await fetch('https://imgtools-be.onrender.com/api/render/env-vars', {
//         method: 'PUT',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ envVarKeyValue })
//     });

//     if (!res.ok) {
//         const text = await res.text();
//         throw new Error(`PUT env var failed: ${text}`);
//     }

//     const json = await res.json();
//     return json.data;
// };

// export const getRenderEnvVars = async () => {
//     const response = await fetch(`https://imgtools-be.onrender.com/api/render/get`, {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//     });

//     if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(JSON.stringify(errorData));
//     }
//     return response.json();
// };

// export const deleteRenderEnvVar = async (key) => {
//     const response = await fetch(`https://imgtools-be.onrender.com/api/render/delete`, {
//         method: 'DELETE',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ key }),
//     });

//     if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(JSON.stringify(errorData));
//     }

//     return response.json();
// };
