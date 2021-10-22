import { css } from '@emotion/core';
import { from } from '@guardian/src-foundations/mq';
import React from 'react';

export const IconSmallEarth: React.FC = () => (
	<div
		css={css`
			position: absolute;
			width: 80px;
			top: 0;
			left: 10px;
			${from.wide} {
				top: 6%;
				left: 1%;
			}
		`}
	>
		<svg fill="none" viewBox="0 0 105 105">
			<path
				d="m34.351.277 1.164 1.67 5.239-.553L48.039 0h7.567l5.54 1.947 4.345-.44 4.596 1.813 5.148.779 1.616 2.848 4.335 1.548 2.7 2.07 3.522 2.326 3.522 4.918 4.055 3.884 3.251 5.953 2.429 3.873 2.98 8.28v6.21L105 52.997l-1.355 10.605-4.596 8.28-6.774 12.686-6.764 7.757-7.847 4.14-9.745 4.918-5.95.512L54.662 105h-8.119l-6.493-1.547-7.035-1.291-7.305-2.07-5.951-4.663-3.523-3.883-4.596-7.245-4.877-6.978-3.242-5.697-1.896-8.536L.27 56.102 0 48.345 1.084 41.1l1.355-6.988-.271-4.919 4.596-6.21 3.522-5.686 5.951-7.245 6.764-4.14 4.335-3.627L34.351.277Z"
				fill="#BFD8E5"
			/>
			<path
				d="M66 9h-5v5h5V9ZM58 13h-6v4h6v-4ZM58 25h-6v4h6v-4ZM83 10h-6v4h6v-4ZM30 12h-5v4h5v-4ZM23 20h-6v5h6v-5ZM15 21H9v6h6v-6ZM42 19h-6v6h6v-6ZM33 22.584 28.83 27 26 23.416 30.17 19 33 22.584ZM16 30h-5v5h5v-5ZM27 30h-5v4h5v-4ZM38 29h-6v5h6v-5ZM63 29h-4v5h4v-5ZM72 24h-5v5h5v-5ZM74.996 22 70 18.014 73.004 13 78 16.976 74.996 22ZM85 18h-5v7h5v-7ZM94 26h-5v6h5v-6ZM84 29h-5v5h5v-5ZM84 38h-4v6h4v-6ZM95.714 43 92 37.36 95.286 34 99 39.64 95.714 43ZM58 43h-6v6h6v-6ZM31 39h-5v5h5v-5ZM23 37h-7v6h7v-6ZM11 38H5v5h6v-5ZM20 46h-5v6h5v-6ZM28 56h-5v7h5v-7ZM17 57h-4v4h4v-4ZM50 48h-4v5h4v-5ZM54 31h-4v5h4v-5ZM63 53h-5v6h5v-6ZM35 61h-5v6h5v-6ZM26 66h-4v5h4v-5ZM17 64h-6v6h6v-6ZM20 73h-4v4h4v-4ZM34 69h-5v6h5v-6ZM29 74h-4v5h4v-5ZM40 78h-5v5h5v-5ZM35 85h-4v5h4v-5ZM38 92h-3v4h3v-4ZM77 75h-5v5h5v-5ZM55 56h-6v3h6v-3ZM74 71h-6v3h6v-3ZM94 20h-6v3h6v-3ZM72 81h-4v5h4v-5ZM65 73h-4v7h4v-7ZM69 65h-5v5h5v-5ZM70 57h-4v3h4v-3ZM75 31h-3v4h3v-4ZM59 60h-3v4h3v-4ZM65 23h-3v4h3v-4ZM65 84h-3v4h3v-4ZM100 28h-3v3h3v-3ZM65 44h-4v6h4v-6Z"
				fill="#063"
			/>
			<path d="M56 95h-4v6h4v-6Z" fill="#fff" />
			<path
				d="M76 45h-4v7h4v-7ZM80 53h-4v5h4v-5ZM100 45h-5v7h5v-7ZM93 73h-4v4h4v-4ZM89.071 42 92 47.102 86.929 51 84 45.91 89.071 42Z"
				fill="#063"
			/>
			<path d="M46.437 0 49 5.101 44.563 9 42 3.899 46.437 0Z" fill="#fff" />
			<path
				d="M73.662 67 70 62.285 73.338 58 77 62.715 73.662 67Z"
				fill="#063"
			/>
		</svg>
	</div>
);
