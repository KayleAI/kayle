"use client";

import { Button } from '@repo/ui/button';
import { login, signup } from './actions'

import { Field, FieldGroup, Fieldset, Label, Legend } from '@repo/ui/fieldset'
import { Input } from '@repo/ui/input'
import { Strong, Text, TextLink } from '@repo/ui/text'
import { Switch } from '@repo/ui/switch'
import { Field as HeadlessField } from '@headlessui/react'

export default function PortalClientPage() {
  return (
    <div className='flex justify-center items-center min-h-screen'>
      <form
        className='max-w-md mx-auto w-full border p-6 rounded-3xl'
      >
        <Fieldset>
          <Legend>
            Sign in to Kayle
          </Legend>
          <Text>

          </Text>
          <FieldGroup>
            <Field>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" />
            </Field>
            <Field>
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" />
            </Field>
            <Field>
              <div className='flex justify-between items-center'>
                <HeadlessField className="flex items-center gap-4">
                  <Switch id="remember" name="remember" />
                  <Label htmlFor="remember">Remember me</Label>
                </HeadlessField>
                <TextLink color='white' href="/forgot" className='text-base/6 sm:text-sm/6'>
                  <Strong>
                    Forgot password?
                  </Strong>
                </TextLink>
              </div>
            </Field>
            <Field>
              <div className='flex flex-row gap-x-4'>
                <Button type="submit" className="w-full" formAction={signup}>
                  Create Account
                </Button>
                <Button type="submit" className="w-full" formAction={login}>
                  Sign In
                </Button>
              </div>
            </Field>
          </FieldGroup>
        </Fieldset>
      </form>
    </div>
  )
}