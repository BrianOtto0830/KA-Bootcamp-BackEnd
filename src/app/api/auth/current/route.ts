import { verifyUser } from "@/lib/verify";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const user = await verifyUser(request);
        console.log(user);
        if(!user)
            return NextResponse.json({ 
                data: null,
                success: false,
                message: "Unauthorized"
             },
             {
                status: 401,
             },
             
        );
        //hilangkan password dari network pada browser
        const {password, ...props} = user
        
        return NextResponse.json({ 
            data: props,
            success: true,
            message: "success"
         });
    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ 
            data: null,
            success: false,
            message: error?.message || "Internal server error"
         },
         {
            status: 500,
         },
        );
    }
}