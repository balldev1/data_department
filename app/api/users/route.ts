// app/api/users/route.ts
import axios from 'axios';

type User = {
    id: number;
    firstName: string;
    lastName: string;
    age: number;
    gender: string;
    hair: { color: string };
    address: { postalCode: string };
    company: { department: string };
};

type TransformedData = {
    [department: string]: {
        male: number;
        female: number;
        ageRange: string;
        hair: { [color: string]: number };
        addressUser: { [fullName: string]: string };
    };
};

// Helper function to calculate age range
const calculateAgeRange = (ages: number[]): string => {
    const min = Math.min(...ages);
    const max = Math.max(...ages);
    return `${min}-${max}`;
};

// Export API route with GET method
export async function GET() {
    try {
        const response = await axios.get('https://dummyjson.com/users');
        const users: User[] = response.data.users;

        const data: TransformedData = {};

        users.forEach((user) => {
            const { department } = user.company; // ดึงแผนกจาก company
            const { gender, age, hair, address, firstName, lastName } = user;
            const fullName = `${firstName} ${lastName}`;

            // ตรวจสอบว่ามีแผนกนี้อยู่ใน data หรือไม่
            if (!data[department]) {
                data[department] = {
                    male: 0,
                    female: 0,
                    ageRange: '',
                    hair: {},
                    addressUser: {}
                };
            }

            // อัปเดตจำนวนเพศ
            data[department][gender.toLowerCase() as 'male' | 'female']++;

            // อัปเดตจำนวนสีผม
            data[department].hair[hair.color] = (data[department].hair[hair.color] || 0) + 1;

            // อัปเดตที่อยู่
            data[department].addressUser[fullName] = address.postalCode;
        });

        // คำนวณช่วงอายุสำหรับแต่ละแผนก
        for (const dept in data) {
            const ages = users
                .filter((u) => u.company.department === dept) // กรองผู้ใช้ตามแผนก
                .map((u) => u.age);
            if (ages.length > 0) {
                data[dept].ageRange = calculateAgeRange(ages);
            } else {
                data[dept].ageRange = 'N/A'; // ถ้าไม่มีผู้ใช้ในแผนกนั้น
            }
        }

        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        console.error('Error fetching data:', error);
        return new Response(JSON.stringify({ message: 'Error fetching data' }), { status: 500 });
    }
}
