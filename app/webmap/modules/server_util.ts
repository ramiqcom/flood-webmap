export async function execute_process(
  cmd: string,
  args: any[],
  signal?: AbortSignal,
  output: boolean = false
) {
  const command = new Deno.Command(cmd, {
    args,
    signal,
  });

  const { code, stdout, stderr } = await command.output();

  if (code == 0) {
    const msg = new TextDecoder().decode(stdout);
    if (output) {
      return msg;
    } else {
      console.log(msg);
      return code;
    }
  } else {
    throw new Error(`Error code ${code}: ${new TextDecoder().decode(stderr)}`);
  }
}
