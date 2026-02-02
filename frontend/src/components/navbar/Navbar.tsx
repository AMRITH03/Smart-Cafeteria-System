import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Navbar() {
    return (
        <header className="w-full bg-blue-600">
            <div className="container mx-auto flex h-16 items-center justify-end px-6">
                <Link href="/login">
                    <Button className="bg-white text-blue-600 border border-white hover:bg-blue-50">
                        Sign In
                    </Button>
                </Link>
            </div>
        </header>
    );
}
