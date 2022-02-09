interface IVirtualHost {
  '{--server-name--}': string;
  '{--server-alias--}': string;
  '{--folder-name--}': string;
}

const VirtualHost = `
  <VirtualHost *:80>

  ServerName {--server-name--}
  ServerAlias {--server-alias--}

  DocumentRoot /var/www/statics/{--folder-name--}
  DirectoryIndex index.html

</VirtualHost>
`

export function stub(data: IVirtualHost) {
  return VirtualHost.replace('{--server-name--}', data['{--server-name--}'])
    .replace('{--server-alias--}', data['{--server-alias--}'])
    .replace('{--folder-name--}', data['{--folder-name--}']);
}
