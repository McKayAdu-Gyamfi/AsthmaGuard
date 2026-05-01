// Using native fetch


async function test() {
  const res = await fetch('http://localhost:4000/api/auth/sign-up/email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: "Test User",
      email: "testuser" + Math.random() + "@example.com",
      password: "Password123!"
    })
  });
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

test();
