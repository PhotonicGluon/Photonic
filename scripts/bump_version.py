import os
import sys

def run(cmd: str):
    exit_code = os.system(cmd)
    sys.exit(exit_code)

args = sys.argv
args.pop(0)
if len(args) == 0:
    run("npm version --help")

new_version = args[0]
if len(args) > 1:
    flags = args[1:]
else:
    flags = []

run(f"npm version {new_version} --no-git-tag-version {' '.join(flags)}")
