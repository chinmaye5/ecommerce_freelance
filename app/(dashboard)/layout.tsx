export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="bg-gray-50/50 min-h-[calc(100vh-64px)]">
            {children}
        </div>
    );
}
