export interface NavItem {
  name: string;
  path: string;
  icon: string;
  children?: NavItem[];
}

export interface AdminLayoutProps {
  children: React.ReactNode;
}
