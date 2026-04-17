const testMissing = async () => {
    try {
        console.log("Testing missing name...");
        const res1 = await fetch('https://hospital-management-system-dxf5.onrender.com/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: "missing_name@example.com", password: "123" })
        });
        console.log("Status missing name:", res1.status);
        console.log("Data:", await res1.json());

        console.log("Testing role validation...");
        const res2 = await fetch('https://hospital-management-system-dxf5.onrender.com/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: "Test",
                email: "bad_role@example.com",
                password: "123",
                role: "GOD"
            })
        });
        console.log("Status bad role:", res2.status);
        // This should probably be 500 or 400 depending on Mongoose
        console.log("Data:", await res2.json());
    } catch (err) {
        console.error("Error:", err);
    }
};

testMissing();
