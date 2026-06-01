'use client';

import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Menu, X, Wallet, LogOut, Settings } from 'lucide-react';

interface NavigationProps {
  user: User | null;
  onLogout: () => Promise<void>;
}

export function Navigation({ user, onLogout }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/dashboard/transactions', label: 'Transactions' },
    // { href: '/dashboard/budgets', label: 'Budgets' }, 
    // { href: '/dashboard/analytics', label: 'Analytics' },
  ];

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center group-hover:bg-primary/90 transition-colors">
              <Wallet className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground hidden sm:inline">Smart Tracker</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant="ghost"
                  className="text-foreground hover:bg-secondary hover:text-foreground"
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-2">
            {user && (
              <>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/30">
                  <img
                    src={user.photoURL || ''}
                    alt={user.displayName || 'User'}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-sm text-foreground font-medium">
                    {user.displayName?.split(' ')[0] || 'User'}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-foreground hover:bg-secondary"
                  onClick={onLogout}
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-foreground" />
            ) : (
              <Menu className="w-5 h-5 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-2 pb-4">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-foreground hover:bg-secondary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
            {user && (
              <div className="pt-4 border-t border-border space-y-2">
                <div className="flex items-center gap-2 px-3 py-2">
                  <img
                    src={user.photoURL || ''}
                    alt={user.displayName || 'User'}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-sm text-foreground font-medium">
                    {user.displayName || 'User'}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-foreground hover:bg-secondary gap-2"
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
