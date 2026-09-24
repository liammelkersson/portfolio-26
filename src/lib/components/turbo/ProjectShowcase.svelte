<script lang="ts">
	import { projects } from '$lib/data/projects';
</script>

<section id="work" class="showcase" aria-label="Project gallery">
	{#each projects as project, index (project.title)}
		{#snippet artwork()}
			<div class="artwork">
				<img
					src={project.image}
					alt="{project.title} project preview"
					loading={index === 0 ? 'eager' : 'lazy'}
					fetchpriority={index === 0 ? 'high' : 'auto'}
				/>
				<div class="label">
					<span>{project.title}</span>
					<span>View project</span>
				</div>
			</div>
		{/snippet}

		{#if project.url}
			<a
				href={project.url}
				target="_blank"
				rel="noopener noreferrer"
				aria-label="View {project.title}: {project.description}"
			>
				{@render artwork()}
			</a>
		{:else}
			<div aria-label="{project.title}: {project.description}">
				{@render artwork()}
			</div>
		{/if}
	{/each}
</section>

<style>
	.showcase {
		display: grid;
		gap: 1.25rem;
	}

	a,
	.showcase > div {
		display: block;
		color: inherit;
		text-decoration: none;
		transition: transform 520ms var(--micro-ease);
	}

	a:hover,
	a:focus-visible,
	.showcase > div:hover {
		transform: translateY(-0.35rem);
	}

	.artwork {
		position: relative;
		overflow: hidden;
		border: 1px solid rgba(255, 255, 255, 0.12);
		border-radius: 0.85rem;
		background: #15161a;
	}

	img {
		display: block;
		width: 100%;
		aspect-ratio: 1.61 / 1;
		object-fit: cover;
		transition: transform 700ms var(--micro-ease), filter 700ms var(--micro-ease);
	}

	a:hover img,
	a:focus-visible img {
		filter: saturate(1.04);
		transform: scale(1.025);
	}

	.label {
		position: absolute;
		right: 1rem;
		bottom: 1rem;
		left: 1rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-radius: 999px;
		background: rgba(10, 11, 14, 0.78);
		padding: 0.75rem 1rem;
		color: white;
		font-size: 0.76rem;
		opacity: 0;
		backdrop-filter: blur(12px);
		transform: translateY(0.5rem);
		transition: opacity 180ms ease, transform 180ms ease;
	}

	a:hover .label,
	a:focus-visible .label {
		opacity: 1;
		transform: translateY(0);
	}

	@media (max-width: 720px) {
		.showcase {
			gap: 0.75rem;
		}

		.artwork {
			border-radius: 0.65rem;
		}

		.label {
			display: none;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		a,
		.showcase > div,
		img,
		.label {
			transition: none;
		}

		a:hover,
		a:focus-visible,
		.showcase > div:hover {
			transform: none;
		}
	}
</style>
