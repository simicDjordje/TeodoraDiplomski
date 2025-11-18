import { ReactNode } from 'react';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from '@heroui/react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar isBordered>
        <NavbarBrand>
          <Link href="/" className="font-bold text-inherit">
            Diplomski
          </Link>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem>
            <Link color="foreground" href="/">
              Početna
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="/events">
              Događaji
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="/organisations">
              Organizacije
            </Link>
          </NavbarItem>
          {isAuthenticated && (
            <>
              <NavbarItem>
                <Link color="foreground" href="/dashboard">
                  Dashboard
                </Link>
              </NavbarItem>
              {(user as any)?.role === 'user' && (
                <NavbarItem>
                  <Link color="foreground" href="/applications">
                    Moje prijave
                  </Link>
                </NavbarItem>
              )}
              {(user as any)?.role === 'organisation' && (
                <NavbarItem>
                  <Link color="foreground" href="/org/applications">
                    Prijave
                  </Link>
                </NavbarItem>
              )}
            </>
          )}
        </NavbarContent>
        <NavbarContent justify="end">
          {isAuthenticated ? (
            <>
              <NavbarItem className="hidden lg:flex">
                <span className="text-sm text-default-500">
                  {user?.email || user?.username}
                </span>
              </NavbarItem>
              <NavbarItem>
                <Button color="danger" variant="flat" onPress={handleLogout}>
                  Odjavi se
                </Button>
              </NavbarItem>
            </>
          ) : (
            <>
              <NavbarItem className="hidden lg:flex">
                <Link href="/login">Prijavi se</Link>
              </NavbarItem>
              <NavbarItem>
                <Button as={Link} color="primary" href="/register" variant="flat">
                  Registruj se
                </Button>
              </NavbarItem>
              <NavbarItem className="hidden md:flex">
                <Link href="/org/register" className="text-sm text-default-500">
                  Registruj organizaciju
                </Link>
              </NavbarItem>
            </>
          )}
        </NavbarContent>
      </Navbar>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;

