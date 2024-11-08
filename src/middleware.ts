import { jwtVerify } from "jose";
import { MiddlewareConfig, NextRequest, NextResponse } from "next/server";

export async function middleware(request:NextRequest) {
    const token = request.cookies.get("token")?.value;

    if(!token){
        return NextResponse.redirect(new URL("/auth/sign-in", request.url));
    }

    try{
        const {payload} = await jwtVerify(token, secret);
        return NextResponse.next();
    } catch(error){
        return NextResponse.redirect(new URL("/login", request.url));
    }
}

export const config: MiddlewareConfig = {
    matcher: ["/", "/products/:path*", "/categories/:path*"],
};