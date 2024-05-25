export const runtime = 'edge';

import { Badge } from '@repo/ui/badge'
import { Button } from '@repo/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@repo/ui/table'
import CreateKeyDialog from './CreateKey'

import { GET } from '../api/keys/route'
import { Code, Strong, Text } from '@repo/ui/text'
import { createClient } from '@/utils/supabase/server'
import { Link } from '@repo/ui/link'

export default async function DisplayUserKeys() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className='text-lg flex flex-col gap-y-2'>
        <Text>
          You need to be logged in to view this page.
        </Text>
        <Link
          href="/portal"
          className="text-blue-500"
        >
          Login
        </Link>
      </main>
    )
  };

  const response = await GET()

  const result = await response.json();
  const keys = result.keys || []

  return (
    <main className='py-40 px-10'>
      <div className='flex flex-col gap-y-8'>
        <div className='flex flex-row justify-between gap-x-4'>
          <div />
          <CreateKeyDialog />
        </div>
        <Table striped className="[--gutter:theme(spacing.6)] sm:[--gutter:theme(spacing.8)]">
          <TableHead>
            <TableRow>
              <TableHeader>
                Key ID
              </TableHeader>
              <TableHeader>
                Key Name
              </TableHeader>
              <TableHeader>
                Key Hint
              </TableHeader>
              <TableHeader>
                Environment
              </TableHeader>
              <TableHeader>
                Actions
              </TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {keys?.map((key: any) => {
              return (
                <TableRow key={key.id} href={`/keys/${key.id}`}>
                  <TableCell className="text-neutral-500">{key.id}</TableCell>
                  <TableCell className="font-medium">{key.name}</TableCell>
                  <TableCell className="font-medium">
                    <Code>
                      {key.start}
                    </Code>
                  </TableCell>
                  <TableCell>
                    {key.environment === "test" ? <Badge color="amber">Testing</Badge> : <Badge color="lime">Production</Badge>}
                  </TableCell>
                  <TableCell>
                    <Button color="white" href={`/keys/${key.id}`}>
                      View Key
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
            {keys.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  <Text>No keys found. <Strong>Create one now!</Strong></Text>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </main>
  )
}