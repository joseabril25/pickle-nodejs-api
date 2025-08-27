import { Request, Response } from 'express';
import { ApiResponse, asyncHandler } from "../../common/utils";
import { AuthService } from "./auth.service";
import { CreatePlayerDto, LoginDto } from '../../common/types/dto';


const authService = new AuthService();

export const registerUser = asyncHandler(
  async (req: Request<{}, {}, CreatePlayerDto>, res: Response) => {
    const result = await authService.register(req.body);
    
    // Cookie settings based on environment
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' as const : 'lax' as const,
    };

    // Set cookies BEFORE sending response
    res.cookie('accessToken', result.accessToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    res.cookie('refreshToken', result.refreshToken, {
      ...cookieOptions,
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });
    
    ApiResponse.success(res, result.player, "User registered successfully", 201);
  }
);


export const loginUser = asyncHandler(
  async (req: Request<{}, {}, LoginDto>, res: Response) => {
    const result = await authService.login(req.body);
    
    // Cookie settings based on environment
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' as const : 'lax' as const,
    };

    // Set cookies BEFORE sending response
    res.cookie('accessToken', result.accessToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    res.cookie('refreshToken', result.refreshToken, {
      ...cookieOptions,
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });
    
    ApiResponse.success(res, result.player, "User logged in successfully");
  }
);

export const logoutUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;
    await authService.logout(refreshToken);
    // Clear cookies
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    
    ApiResponse.noContent(res);
  }
);

export const refreshAccessToken = asyncHandler(
  async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;

    const result = await authService.refreshToken(refreshToken);
    
    // Set new access token cookie
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });
      
    ApiResponse.noContent(res);
  }
);

export const getCurrentUser = asyncHandler(
  async (req: Request, res: Response) => {
    const playerId = req.player!.playerId; // AuthGuard ensures req.user exists

    const user = await authService.getCurrentUser(playerId);
    
    ApiResponse.success(res, user, "User profile retrieved successfully");
  }
);