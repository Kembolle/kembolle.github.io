#! /bin/sh
cd /home/usuario/Desktop
mv *.desktop /tmp

cd /home/usuario/
mv .* /tmp/arquivos
cd /home/usuario/
rm -fr *

mkdir /home/usuario/Desktop
mkdir /home/usuario/Documents
chown usuario.usuario /home/usuario/Documents

mv /tmp/*.desktop /home/usuario/Desktop
mv /tmp/arquivos/.* /home/usuario

rm -rf /home/usuario/.local/share/Trash/files/*