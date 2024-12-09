import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const revalidate = 0;

export const metadata = {
  title: "TrendEra Backend Dashboard | TailAdmin",
  description:
    "Manage your TrendEra backend seamlessly with TailAdmin, a powerful Next.js dashboard template. Designed for efficiency and scalability, it’s perfect for handling product data, user management, and analytics in your e-commerce platform.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DefaultLayout> {children}</DefaultLayout>;
}
  