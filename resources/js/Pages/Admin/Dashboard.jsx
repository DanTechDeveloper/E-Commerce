import AdminLayout from "@/Layouts/Admin/AdminLayout";
import { Head } from "@inertiajs/react";

export default function Dashboard() {
    return <>
        <Head title="Dashboard" />
        <AdminLayout>
            <h1>Dashboard</h1>
            <p>Welcome to the admin dashboard</p>
            
        </AdminLayout>
    </>
}