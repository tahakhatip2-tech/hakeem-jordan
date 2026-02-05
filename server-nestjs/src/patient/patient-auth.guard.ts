import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class PatientAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException('يرجى تسجيل الدخول');
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET,
            });

            // Check if this is a patient token
            if (payload.type !== 'patient') {
                throw new UnauthorizedException('غير مصرح');
            }

            // Attach user data to request
            request.user = {
                id: payload.sub,
                email: payload.email,
            };
        } catch {
            throw new UnauthorizedException('الجلسة منتهية، يرجى تسجيل الدخول مرة أخرى');
        }

        return true;
    }

    private extractTokenFromHeader(request: any): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
