<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Str;

class AuthController extends Controller
{

    /**
 * @OA\Post(
 *     path="/api/register",
 *     summary="Register a new user",
 *     tags={"Authentication"},
 *     @OA\RequestBody(
 *         @OA\JsonContent(
 *             required={"name","email","password"},
 *             @OA\Property(property="name", type="string"),
 *             @OA\Property(property="email", type="string", format="email"),
 *             @OA\Property(property="password", type="string", format="password"),
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="User registered successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="user", type="object"),
 *             @OA\Property(property="access_token", type="string")
 *         )
 *     )
 * )
 */
    public function register(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        $user = User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => Hash::make($validatedData['password']),
        ]);

        $token = $user->createToken('MyAppToken')->accessToken;

        return response(['user' => $user, 'access_token' => $token]);
    }


    /**
 * @OA\Post(
 *     path="/api/login",
 *     summary="Authenticate user and return a token",
 *     tags={"Authentication"},
 *     @OA\RequestBody(
 *         @OA\JsonContent(
 *             required={"email","password"},
 *             @OA\Property(property="email", type="string", format="email"),
 *             @OA\Property(property="password", type="string", format="password"),
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="User authenticated successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="user", type="object"),
 *             @OA\Property(property="access_token", type="string")
 *         )
 *     ),
 *     @OA\Response(
 *         response=401,
 *         description="Invalid credentials"
 *     )
 * )
 */
    public function login(Request $request)
    {
        $loginData = $request->validate([
            'email' => 'email|required',
            'password' => 'required'
        ]);

        if (!Auth::attempt($loginData)) {
            return response(['message' => 'Invalid credentials']);
        }

        $user = Auth::user();
        $accessToken = $user->createToken('authToken')->plainTextToken;

        return response(['user' => $user, 'access_token' => $accessToken]);
    }


    /**
 * @OA\Post(
 *     path="/api/logout",
 *     summary="Log the user out (Invalidate the token)",
 *     tags={"Authentication"},
 *     security={{ "apiAuth": {} }},
 *     @OA\Response(
 *         response=200,
 *         description="Successfully logged out"
 *     )
 * )
 */
    public function logout(Request $request)
    {
        $request->user()->token()->revoke();
        return response(['message' => 'You have been successfully logged out!']);
    }


    public function sendResetLinkEmail(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $status = Password::sendResetLink(
            $request->only('email')
        );

        return $status === Password::RESET_LINK_SENT
                    ? response()->json(['status' => __($status)], 200)
                    : response()->json(['email' => __($status)], 400);
    }

    public function reset(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|confirmed|min:8',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password)
                ])->setRememberToken(Str::random(60));

                $user->save();

                event(new PasswordReset($user));
            }
        );

        return $status == Password::PASSWORD_RESET
                    ? response()->json(['status' => __($status)])
                    : response()->json(['email' => [__($status)]], 400);
    }
}
