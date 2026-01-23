"use client"

import { Button } from "@mui/material";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function SubscriptionResult(props: any) {
    const searchParams = useSearchParams();
    const status = searchParams.get('status')

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: 64,
            }}
        >
            {status === "success" ? (
                <>
                    <div style={{ fontSize: 60, color: "#16a34a", margin: '2rem 0 0rem' }}>
                        ✓
                    </div>
                    <h2 style={{ color: "#16a34a", marginBottom: 8 }}>
                        Subscription Successful
                    </h2>
                    <p>Your subscription has been activated. Thank you!</p>
                    <Link href={'/'}>
                        <Button>Back to the Home</Button>
                    </Link>
                </>
            ) : (
                <>
                    <div style={{ fontSize: 60, color: "#dc2626", margin: '2rem 0 0rem' }}>
                        ✗
                    </div>
                    <h2 style={{ color: "#dc2626", marginBottom: 8 }}>
                        Subscription Failed
                    </h2>
                    <p>
                        There was an issue processing your subscription. Please try again.
                    </p>
                    <Link href={'/'}>
                        <Button>Back to the Home</Button>
                    </Link>
                </>
            )}
        </div>
    );
}
