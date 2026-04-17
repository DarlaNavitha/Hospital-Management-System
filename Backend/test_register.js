const testMissing = async () => {
    try {
        const res = await fetch(
            'https://hospital-management-system-dxf5.onrender.com/api/auth/register',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: "Admin",
                    email: "admin@hospital.com",
                    password: "1234",
                    role: "admin"
                })
            }
        );

        console.log("Status:", res.status);
        console.log("Data:", await res.json());
    } catch (err) {
        console.error(err);
    }
};

testMissing();