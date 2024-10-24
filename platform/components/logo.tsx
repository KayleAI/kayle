"use client";

import { clsx } from "clsx";
import { motion } from "framer-motion";

export function Logo({ className }: { readonly className?: string }) {
	return (
		<motion.svg
			variants={{ idle: {}, active: {} }}
			initial="idle"
			whileHover="active"
			width={179}
			height={34}
			viewBox="0 0 179 34"
			className={clsx(className, "overflow-visible")}
		>
			<title>{/* */}</title>
			<path d="M11.0341 28H5.76136L13.7955 4.72727H20.1364L28.1591 28H22.8864L17.0568 10.0455H16.875L11.0341 28ZM10.7045 18.8523H23.1591V22.6932H10.7045V18.8523Z" />
			<path d="M47.52 21.18V19.1H54.18V21.18H47.52ZM54.82 24L51.28 14.44L50.78 12.7H50.98L50.48 14.44L46.94 24H44.24L49.36 10.4H52.54L57.66 24H54.82ZM59.0863 24V13.28H61.6463V24H59.0863ZM61.6463 17.78H60.8263C60.8929 16.7 61.0929 15.8067 61.4263 15.1C61.7596 14.3933 62.1996 13.8667 62.7463 13.52C63.2929 13.16 63.9196 12.98 64.6263 12.98C65.2929 12.98 65.8729 13.1267 66.3663 13.42C66.8729 13.7 67.2663 14.1267 67.5463 14.7C67.8263 15.2733 67.9663 15.9933 67.9663 16.86V24H65.4063V17.38C65.4063 16.8867 65.3463 16.4733 65.2263 16.14C65.1063 15.7933 64.9196 15.5333 64.6663 15.36C64.4129 15.1867 64.0996 15.1 63.7263 15.1C63.4063 15.1 63.1196 15.1733 62.8663 15.32C62.6129 15.4533 62.3929 15.6467 62.2063 15.9C62.0196 16.14 61.8796 16.4267 61.7863 16.76C61.6929 17.08 61.6463 17.42 61.6463 17.78ZM67.9663 17.78H66.7863C66.8529 16.7 67.0596 15.8067 67.4063 15.1C67.7663 14.3933 68.2396 13.8667 68.8263 13.52C69.4129 13.16 70.0796 12.98 70.8263 12.98C71.5063 12.98 72.1063 13.1267 72.6263 13.42C73.1596 13.7 73.5663 14.1267 73.8463 14.7C74.1396 15.2733 74.2863 15.9933 74.2863 16.86V24H71.7263V17.38C71.7263 16.8867 71.6663 16.4733 71.5463 16.14C71.4263 15.7933 71.2396 15.5333 70.9863 15.36C70.7463 15.1867 70.4329 15.1 70.0463 15.1C69.7263 15.1 69.4396 15.1733 69.1863 15.32C68.9329 15.4533 68.7129 15.6467 68.5263 15.9C68.3396 16.14 68.1996 16.4267 68.1063 16.76C68.0129 17.08 67.9663 17.42 67.9663 17.78ZM79.1248 16.8H76.5448C76.6648 16 76.9248 15.32 77.3248 14.76C77.7382 14.1867 78.2782 13.7467 78.9448 13.44C79.6248 13.1333 80.4182 12.98 81.3248 12.98C82.3115 12.98 83.1382 13.16 83.8048 13.52C84.4848 13.88 84.9915 14.38 85.3248 15.02C85.6582 15.66 85.8248 16.3933 85.8248 17.22V21.38C85.8248 22.0333 85.8515 22.5667 85.9048 22.98C85.9715 23.38 86.0515 23.72 86.1448 24H83.4848C83.3782 23.7333 83.3115 23.4 83.2848 23C83.2582 22.5867 83.2448 22.1733 83.2448 21.76V17.22C83.2448 16.5267 83.0715 16 82.7248 15.64C82.3915 15.28 81.8715 15.1 81.1648 15.1C80.5515 15.1 80.0782 15.26 79.7448 15.58C79.4115 15.8867 79.2048 16.2933 79.1248 16.8ZM83.5848 17.48V19.06C82.5982 19.06 81.7915 19.1133 81.1648 19.22C80.5382 19.3133 80.0515 19.4533 79.7048 19.64C79.3582 19.8267 79.1115 20.04 78.9648 20.28C78.8315 20.52 78.7648 20.78 78.7648 21.06C78.7648 21.4733 78.9182 21.8 79.2248 22.04C79.5315 22.28 79.9382 22.4 80.4448 22.4C80.9648 22.4 81.4382 22.2733 81.8648 22.02C82.2915 21.7667 82.6248 21.42 82.8648 20.98C83.1182 20.54 83.2448 20.0533 83.2448 19.52H84.2248C84.1715 20.3733 84.0048 21.1067 83.7248 21.72C83.4582 22.32 83.1115 22.8133 82.6848 23.2C82.2715 23.5733 81.8115 23.8467 81.3048 24.02C80.7982 24.2067 80.2915 24.3 79.7848 24.3C79.0782 24.3 78.4515 24.1867 77.9048 23.96C77.3715 23.72 76.9515 23.3733 76.6448 22.92C76.3382 22.4533 76.1848 21.88 76.1848 21.2C76.1848 20.4667 76.3848 19.84 76.7848 19.32C77.1982 18.7867 77.8182 18.38 78.6448 18.1C79.3915 17.8333 80.1515 17.6667 80.9248 17.6C81.7115 17.52 82.5982 17.48 83.5848 17.48ZM87.9059 15.26V13.28H96.5459V15.26H87.9059ZM87.6859 24V22.04H96.8859V24H87.6859ZM87.6859 22.04L93.5059 15.26H96.5459L90.7259 22.04H87.6859ZM103.004 24.3C101.937 24.3 101.017 24.0733 100.244 23.62C99.4836 23.1667 98.8969 22.52 98.4836 21.68C98.0703 20.8267 97.8636 19.82 97.8636 18.66C97.8636 17.4467 98.0703 16.42 98.4836 15.58C98.9103 14.7267 99.5103 14.08 100.284 13.64C101.057 13.2 101.964 12.98 103.004 12.98C104.057 12.98 104.964 13.2133 105.724 13.68C106.497 14.1333 107.09 14.7867 107.504 15.64C107.917 16.48 108.124 17.4867 108.124 18.66C108.124 19.86 107.91 20.88 107.484 21.72C107.07 22.56 106.477 23.2 105.704 23.64C104.944 24.08 104.044 24.3 103.004 24.3ZM103.004 22.18C103.804 22.18 104.417 21.88 104.844 21.28C105.27 20.6667 105.484 19.7933 105.484 18.66C105.484 17.5133 105.27 16.6333 104.844 16.02C104.417 15.4067 103.804 15.1 103.004 15.1C102.19 15.1 101.57 15.4067 101.144 16.02C100.717 16.62 100.504 17.5 100.504 18.66C100.504 19.78 100.717 20.6467 101.144 21.26C101.57 21.8733 102.19 22.18 103.004 22.18ZM109.985 24V13.28H112.545V24H109.985ZM112.545 17.78H111.725C111.791 16.7 111.998 15.8067 112.345 15.1C112.691 14.3933 113.151 13.8667 113.725 13.52C114.311 13.16 114.978 12.98 115.725 12.98C116.445 12.98 117.071 13.1267 117.605 13.42C118.151 13.7 118.571 14.1267 118.865 14.7C119.171 15.2733 119.325 15.9933 119.325 16.86V24H116.765V17.38C116.765 16.8867 116.691 16.4733 116.545 16.14C116.411 15.7933 116.205 15.5333 115.925 15.36C115.645 15.1867 115.285 15.1 114.845 15.1C114.498 15.1 114.178 15.1733 113.885 15.32C113.605 15.4533 113.365 15.6467 113.165 15.9C112.965 16.14 112.811 16.4267 112.705 16.76C112.598 17.08 112.545 17.42 112.545 17.78ZM126.324 24.3C125.257 24.3 124.337 24.0733 123.564 23.62C122.804 23.1667 122.217 22.52 121.804 21.68C121.391 20.8267 121.184 19.82 121.184 18.66C121.184 17.4467 121.391 16.42 121.804 15.58C122.231 14.7267 122.831 14.08 123.604 13.64C124.377 13.2 125.284 12.98 126.324 12.98C127.377 12.98 128.284 13.2133 129.044 13.68C129.817 14.1333 130.411 14.7867 130.824 15.64C131.237 16.48 131.444 17.4867 131.444 18.66C131.444 19.86 131.231 20.88 130.804 21.72C130.391 22.56 129.797 23.2 129.024 23.64C128.264 24.08 127.364 24.3 126.324 24.3ZM126.324 22.18C127.124 22.18 127.737 21.88 128.164 21.28C128.591 20.6667 128.804 19.7933 128.804 18.66C128.804 17.5133 128.591 16.6333 128.164 16.02C127.737 15.4067 127.124 15.1 126.324 15.1C125.511 15.1 124.891 15.4067 124.464 16.02C124.037 16.62 123.824 17.5 123.824 18.66C123.824 19.78 124.037 20.6467 124.464 21.26C124.891 21.8733 125.511 22.18 126.324 22.18ZM133.305 24V13.28H135.865V24H133.305ZM135.865 17.78H135.045C135.112 16.7 135.312 15.8067 135.645 15.1C135.978 14.3933 136.418 13.8667 136.965 13.52C137.512 13.16 138.138 12.98 138.845 12.98C139.512 12.98 140.092 13.1267 140.585 13.42C141.092 13.7 141.485 14.1267 141.765 14.7C142.045 15.2733 142.185 15.9933 142.185 16.86V24H139.625V17.38C139.625 16.8867 139.565 16.4733 139.445 16.14C139.325 15.7933 139.138 15.5333 138.885 15.36C138.632 15.1867 138.318 15.1 137.945 15.1C137.625 15.1 137.338 15.1733 137.085 15.32C136.832 15.4533 136.612 15.6467 136.425 15.9C136.238 16.14 136.098 16.4267 136.005 16.76C135.912 17.08 135.865 17.42 135.865 17.78ZM142.185 17.78H141.005C141.072 16.7 141.278 15.8067 141.625 15.1C141.985 14.3933 142.458 13.8667 143.045 13.52C143.632 13.16 144.298 12.98 145.045 12.98C145.725 12.98 146.325 13.1267 146.845 13.42C147.378 13.7 147.785 14.1267 148.065 14.7C148.358 15.2733 148.505 15.9933 148.505 16.86V24H145.945V17.38C145.945 16.8867 145.885 16.4733 145.765 16.14C145.645 15.7933 145.458 15.5333 145.205 15.36C144.965 15.1867 144.652 15.1 144.265 15.1C143.945 15.1 143.658 15.1733 143.405 15.32C143.152 15.4533 142.932 15.6467 142.745 15.9C142.558 16.14 142.418 16.4267 142.325 16.76C142.232 17.08 142.185 17.42 142.185 17.78ZM150.864 24V13.28H153.424V24H150.864ZM150.864 12.08V9.6H153.424V12.08H150.864ZM165.046 17.08H162.486C162.366 16.3867 162.106 15.8867 161.706 15.58C161.319 15.26 160.859 15.1 160.326 15.1C159.526 15.1 158.919 15.4067 158.506 16.02C158.106 16.62 157.906 17.5 157.906 18.66C157.906 19.7933 158.119 20.6667 158.546 21.28C158.973 21.88 159.593 22.18 160.406 22.18C160.953 22.18 161.413 22.0333 161.786 21.74C162.159 21.4333 162.413 20.9733 162.546 20.36H165.126C164.886 21.7067 164.333 22.7 163.466 23.34C162.599 23.98 161.559 24.3 160.346 24.3C159.293 24.3 158.386 24.0733 157.626 23.62C156.879 23.1533 156.299 22.5 155.886 21.66C155.473 20.82 155.266 19.82 155.266 18.66C155.266 17.4467 155.473 16.42 155.886 15.58C156.299 14.7267 156.886 14.08 157.646 13.64C158.406 13.2 159.299 12.98 160.326 12.98C161.139 12.98 161.879 13.1333 162.546 13.44C163.226 13.7467 163.786 14.2067 164.226 14.82C164.666 15.42 164.939 16.1733 165.046 17.08ZM169.039 16.16C169.039 16.52 169.159 16.7933 169.399 16.98C169.639 17.1667 169.959 17.3133 170.359 17.42C170.772 17.5133 171.219 17.6 171.699 17.68C172.179 17.7467 172.659 17.84 173.139 17.96C173.619 18.08 174.059 18.2467 174.459 18.46C174.859 18.6733 175.179 18.9667 175.419 19.34C175.672 19.7133 175.799 20.2133 175.799 20.84C175.799 21.52 175.599 22.12 175.199 22.64C174.812 23.16 174.279 23.5667 173.599 23.86C172.919 24.1533 172.125 24.3 171.219 24.3C169.899 24.3 168.792 23.9933 167.899 23.38C167.019 22.7533 166.485 21.7933 166.299 20.5H168.859C168.952 21.0733 169.212 21.52 169.639 21.84C170.079 22.16 170.632 22.32 171.299 22.32C171.939 22.32 172.419 22.2 172.739 21.96C173.059 21.7067 173.219 21.3867 173.219 21C173.219 20.6533 173.099 20.3867 172.859 20.2C172.619 20.0133 172.299 19.8733 171.899 19.78C171.512 19.6867 171.079 19.6 170.599 19.52C170.132 19.44 169.665 19.3467 169.199 19.24C168.732 19.12 168.299 18.9533 167.899 18.74C167.512 18.5133 167.199 18.2133 166.959 17.84C166.719 17.4533 166.599 16.9467 166.599 16.32C166.599 15.7333 166.752 15.1933 167.059 14.7C167.365 14.1933 167.825 13.78 168.439 13.46C169.052 13.14 169.825 12.98 170.759 12.98C171.585 12.98 172.325 13.1133 172.979 13.38C173.632 13.6467 174.172 14.06 174.599 14.62C175.039 15.18 175.305 15.9067 175.399 16.8H172.839C172.732 16.1467 172.492 15.68 172.119 15.4C171.759 15.12 171.272 14.98 170.659 14.98C170.152 14.98 169.752 15.0933 169.459 15.32C169.179 15.5467 169.039 15.8267 169.039 16.16Z" />
		</motion.svg>
	);
}

export function Mark({ className }: { readonly className?: string }) {
	return (
		<svg viewBox="0 0 34 34" fill="none" className={className}>
			<title>{/* */}</title>
			<path d="M11.0341 28H5.76136L13.7955 4.72727H20.1364L28.1591 28H22.8864L17.0568 10.0455H16.875L11.0341 28ZM10.7045 18.8523H23.1591V22.6932H10.7045V18.8523Z" />
		</svg>
	);
}
